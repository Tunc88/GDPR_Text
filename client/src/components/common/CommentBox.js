import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { setComment } from "../../actions/projectActions";
import {
  Panel,
  Button,
  FormGroup,
  InputGroup,
  FormControl
} from "react-bootstrap";

import TextAreaField from "../common/TextAreaField";
import "./CommentBox.css";

class CommentBox extends Component {
  constructor() {
    super();
    this.state = {
      comment: {
        author: {},
        content: ""
      },

      errors: {}
    };

    this.convertDate = this.convertDate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.correctX = this.correctX.bind(this);
  }

  correctX(id, x) {
    var index;
    var tempArr = [];

    if (this.props.project.commentAttendees) {
      if (this.props.project.commentAttendees.length === 0) {
        if (x === "name") {
          return this.props.auth.user.name;
        } else {
          return this.props.auth.user.role;
        }
      } else {
        for (var i = 0; i < this.props.project.commentAttendees.length; i++) {
          tempArr.push(this.props.project.commentAttendees[i]._id);
        }
      }

      index = tempArr.indexOf(id);

      if (x === "name") {
        return this.props.project.commentAttendees[index].name;
      } else {
        return this.props.project.commentAttendees[index].role;
      }
    }
  }

  /*componentDidUpdate() {
    setTimeout(() => {
      this.setState({ state: this.state });
    }, 1000);
  }*/

  convertDate(isoDate) {
    const date = new Date(isoDate);
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const DMY = date.toDateString();

    return (
      (hour < 10 ? "0" + hour : hour) +
      ":" +
      (minute < 10 ? "0" + minute : minute) +
      ", " +
      DMY
    );
  }

  onChange(e) {
    this.setState({
      comment: {
        author: this.props.auth.user.id,
        content: e.target.value
      }
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const commentData = {
      id: this.props.match.params.id,
      comment: this.state.comment
    };

    console.log(commentData);

    //console.log(editedProject);

    this.props.setComment(commentData);

    //this.setState({ content: "" });

    //this.props.editProject(commentData);
  }

  render() {
    //console.log(this.props.match.params.id);
    //console.log(this.state.comment);

    return (
      <div>
        <Panel>
          <Panel.Heading>
            <Panel.Title componentClass="h3">Comment Box</Panel.Title>
          </Panel.Heading>
          <Panel.Body id="commentBox">
            <div className="chatBox">
              {this.props.comment
                ? this.props.comment.length !== 0
                  ? this.props.comment.map(comment => (
                      <div key={comment._id}>
                        {this.convertDate(comment.date)},{" "}
                        {this.correctX(comment.author, "name")},{" "}
                        {this.correctX(comment.author, "role")}
                        <Panel>
                          <Panel.Body>{comment.content}</Panel.Body>
                        </Panel>
                      </div>
                    ))
                  : ""
                : ""}
            </div>

            <TextAreaField
              name="content"
              value={this.state.content}
              placeholder="Enter your comment"
              onChange={this.onChange}
              location={this.props.location}
              onSubmit={this.onSubmit}
            />
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

CommentBox.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  comment: state.project.comment
});

export default connect(
  mapStateToProps,
  {
    setComment
  }
)(withRouter(CommentBox));
