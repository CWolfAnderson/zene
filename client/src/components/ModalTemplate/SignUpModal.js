/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { Component } from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

class SignUpModal extends Component {
  state = {
    modalIsOpen: false,
  }

  toggleModal = () => {
    const { modalIsOpen } = this.state;
    this.setState({
      modalIsOpen: !modalIsOpen,
    });
  }

  render() {
    const { modalIsOpen } = this.state;

    return (
      <div>
        <button
          className="btn btn-info"
          onClick={this.toggleModal}
          type="button"
        >
          Sign Up!
        </button>
        <Modal isOpen={modalIsOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            Sign Up!
          </ModalHeader>
          <ModalBody>
            Sign up
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-info"
              onClick={this.toggleModal}
              type="button"
            >
              Okay
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default SignUpModal;
