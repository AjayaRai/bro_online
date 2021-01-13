import React, {Component} from 'react';
import axios from 'axios';
import Tribe from "../components/Tribe";
import AddMember from "../components/AddMember";
import Navbar from "../components/Navbar";

class Group extends Component {
    state = {
        groupMembers: null,
    }

    componentDidMount() {
        const docId = this.props.match.params.docId;

        axios
            .get(`/groups/${docId}`)
            .then((res) => {
                this.setState({
                    groupMembers: res.data,
                })

            }).catch((err) => {
                console.error(err);
            })
    }

    render() {
        return (
            <>
                <Navbar />
                <div>
                    <Tribe groupMembers={this.state.groupMembers ? this.state.groupMembers : null}/>
                    <AddMember docId={this.props.match.params.docId}/>
                </div>
            </>
        );
    }
}

export default Group;