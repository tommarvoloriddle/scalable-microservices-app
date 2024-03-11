import React from 'react';
import { connect } from 'react-redux';
import { setUUID } from '../../store/actions/user-actions';
import { USER_API } from '../../constants';
class UserProfile extends React.Component {
    componentDidMount() {
        const { setUUID } = this.props;
        const token = window.localStorage.getItem('accessToken');
        fetch(USER_API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.user);
            setUUID(data.user);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    render() {
        const { uuid } = this.props;
        return (
            <div>
                <h1>User Profile: {uuid}</h1>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    uuid: state.user.uuid,
});

const mapDispatchToProps = {
    setUUID
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
