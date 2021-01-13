import React, {Component} from "react";
import { Link } from 'react-router-dom';

class AddMember extends Component {

    render() {
        return (
            <Link to={`/group/${this.props.docId}/search`}>
                Add Member
            </Link>
        );
    }
}

export default AddMember;