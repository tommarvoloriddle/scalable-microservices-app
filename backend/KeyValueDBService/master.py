#  create  Master class to handle the requests
from sortedcontainers import SortedList
from slave_service import CreateSlaveService
import requests
from multiprocessing import Process

SLAVE_IPS = ['http://localhost:5001', 'http://localhost:5002', 'http://localhost:5003', 'http://localhost:5004', 'http://localhost:5005']

class Master:
    def __init__(self):
        print("Initializing Master...")
        self.noOfSlaves = 3
        self.slaves = {}
        self.slave_id = 0
        self.MaxSizeOfHash = 2**32
        self.virtualNodeIds = SortedList()
        self.virualNodes = 10
        self.virtualNodeToSlaveMap = {}
        self.hashes = SortedList()
        for i in range(self.noOfSlaves):
            self.slaves[i] = SLAVE_IPS[i]
        self.init_circularHashSpace()
        print("Master initialization complete.")
        
    def get(self, key):
        print(f"Fetching value for key '{key}'...")
        hash_key = hash(key) % self.MaxSizeOfHash
        slave_id = self.get_slave_id(key)
        slave_URL = self.slaves[slave_id] + '/getKey' + '?key=' + str(hash_key)
        response = requests.get(slave_URL)
        if response.status_code == 404:
            return None
        return response.json()['value']
        # return self.slaves[slave_id].get(hash_key)
    
    def set(self, key, value):
        print(f"Setting value '{value}' for key '{key}'...")
        hash_key = hash(key) % self.MaxSizeOfHash
        self.hashes.add(hash_key)
        slave_id = self.get_slave_id(key)
        slave_URL = self.slaves[slave_id] + '/setKey' + '?key=' + str(hash_key) + '&value=' + str(value)
        response = requests.get(slave_URL)
        if response.status_code == 404:
            return None
        return response.json()['value']

    def get_slave_id(self, key):
        hash_key = hash(key) % self.MaxSizeOfHash
        index = self.virtualNodeIds.bisect_right(hash_key)
        if index == len(self.virtualNodeIds):
            index = 0
        print(f"Slave ID for key '{key}' is {self.virtualNodeToSlaveMap[self.virtualNodeIds[index]]}")
        return self.virtualNodeToSlaveMap[self.virtualNodeIds[index]]

    def init_circularHashSpace(self):
        print("Initializing circular hash space...")
        for slave in self.slaves.keys():
            for i in range(self.virualNodes):
                hash_key_of_virtual_node = hash(str(i) + str(slave)) % self.MaxSizeOfHash
                self.hashes.add(hash_key_of_virtual_node)
                self.virtualNodeIds.add(hash_key_of_virtual_node)
                self.virtualNodeToSlaveMap[hash_key_of_virtual_node] = slave
        print("Circular hash space initialization complete.")

    def add_slave(self):
        self.noOfSlaves += 1
        slave = self.slave_id
        self.slaves[self.slave_id] = CreateSlaveService(self.slave_id + 1)
        self.slave_id += 1

        for i in range(self.virualNodes):
            hash_key_of_virtual_node = hash(str(i) + str(slave)) % self.MaxSizeOfHash
            right_slave_index = self.virtualNodeIds.bisect_right(hash_key_of_virtual_node)
            left_slave_index = right_slave_index - 1 

            if right_slave_index == len(self.virtualNodeIds):
                right_slave_index = 0

            if left_slave_index == -1:
                left_slave_index = len(self.virtualNodeIds) - 1

            right_index = self.hashes.index(self.virtualNodeIds[right_slave_index])
            left_index = self.hashes.index(self.virtualNodeIds[left_slave_index])

            if right_index <= left_index:
                keys_between_left_and_right = self.hashes[left_index + 1:] + self.hashes[:right_index]
            else:
                keys_between_left_and_right = self.hashes[left_index + 1:right_index]

            
            right_slave = self.virtualNodeToSlaveMap[self.virtualNodeIds[right_slave_index]]
            for key in keys_between_left_and_right:
                hash_key = hash(key) % self.MaxSizeOfHash
                if hash_key < hash_key_of_virtual_node:
                    # check if already pop
                    if key in self.slaves[right_slave].cache.db.keys():
                        value = self.slaves[right_slave].cache.db.pop(key)
                        self.slaves[slave].set(hash_key, value)
                
            self.virtualNodeIds.add(hash_key_of_virtual_node)
            self.hashes.add(hash_key_of_virtual_node)
            self.virtualNodeToSlaveMap[hash_key_of_virtual_node] = slave

    def remove_slave(self, slave):
        curr_slave = slave
        for i in range(self.virualNodes):
            hash_key_of_virtual_node =  hash(str(i) + str(slave)) % self.MaxSizeOfHash
            next_idx = self.virtualNodeIds.index(hash_key_of_virtual_node) + 1
            previous_idx = self.virtualNodeIds.index(hash_key_of_virtual_node) - 1

            if next_idx == len(self.virtualNodeIds):
                next_idx = 0

            next_slave = self.virtualNodeToSlaveMap[self.virtualNodeIds[next_idx]]

            if previous_idx == -1:
                previous_idx = len(self.virtualNodeIds) - 1

            right_index = self.hashes.index(hash_key_of_virtual_node)
            left_index = self.hashes.index(self.virtualNodeIds[previous_idx])

            if right_index <= left_index:
                keys_between_left_and_right = self.hashes[left_index + 1:] + self.hashes[:right_index]
            else:
                keys_between_left_and_right = self.hashes[left_index + 1:right_index]

            for key in keys_between_left_and_right:
                hash_key = hash(key) % self.MaxSizeOfHash
                if hash_key < hash_key_of_virtual_node:
                    # check if already pop
                    if key in self.slaves[curr_slave].cache.db.keys():
                        value = self.slaves[curr_slave].cache.db.pop(key)
                        self.slaves[next_slave].set(hash_key, value)

            self.virtualNodeIds.remove(hash_key_of_virtual_node)
            self.hashes.remove(hash_key_of_virtual_node)
            self.virtualNodeToSlaveMap.pop(hash_key_of_virtual_node)
        
        self.slaves.pop(slave)
    def getMaster(self):
        print("Fetching master...")
        for slave in self.slaves.keys():
            print(f"Slave {slave}: {self.slaves[slave].cache.db}")
        return self.slaves

# #  add test
        
# master = Master()
# master.set("key1", "value1")
# master.set("key2", "value2")
# master.set("key3", "value3")
# master.set("key4", "value$4")
# # Continued test
# master.set("key5", "value5")
# master.set("key6", "value6")
# master.getMaster()
# # Fetch values for the keys
# print("\nFetching values:")
# keys_to_fetch = ["key1", "key2", "key3", "key4", "key5", "key6"]
# for key in keys_to_fetch:
#     print(f"Value for {key}: {master.get(key)}")

# print('-____-___________________________________________________S')
# # Add a new slave
# master.add_slave()

# master.getMaster()
# print("\nFetching values:")
# keys_to_fetch = ["key1", "key2", "key3", "key4", "key5", "key6"]
# for key in keys_to_fetch:
#     print(f"Value for {key}: {master.get(key)}")

# print('-____-___________________________________________________S')
# # Reamove a new slave
# master.remove_slave(0)

# master.getMaster()
# print("\nFetching values:")
# keys_to_fetch = ["key1", "key2", "key3", "key4", "key5", "key6"]
# for key in keys_to_fetch:
#     print(f"Value for {key}: {master.get(key)}")
