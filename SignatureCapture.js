import React, { Component } from 'react';
import { requireNativeComponent, findNodeHandle, View, UIManager, DeviceEventEmitter } from 'react-native';
import PropTypes from 'prop-types';

class SignatureCapture extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.subscriptions = [];
  }

  onChange({ nativeEvent }) {
    if (nativeEvent.pathName) {
      if (!this.props.onSaveEvent) {
        return;
      }
      this.props.onSaveEvent({
        pathName: nativeEvent.pathName,
        encoded: nativeEvent.encoded,
        pathNameTrimmed: nativeEvent.pathNameTrimmed,
        encodedTrimmed: nativeEvent.encodedTrimmed,
        width: nativeEvent.width,
        height: nativeEvent.height,
      });
    }

    if (nativeEvent.dragged) {
      if (!this.props.onDragEvent) {
        return;
      }
      this.props.onDragEvent({
        dragged: nativeEvent.dragged,
      });
    }
  }

  componentDidMount() {
    if (this.props.onSaveEvent) {
      const sub = DeviceEventEmitter.addListener('onSaveEvent', this.props.onSaveEvent);
      this.subscriptions.push(sub);
    }

    if (this.props.onDragEvent) {
      const sub = DeviceEventEmitter.addListener('onDragEvent', this.props.onDragEvent);
      this.subscriptions.push(sub);
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.remove());
    this.subscriptions = [];
  }

  render() {
    return <RSSignatureView {...this.props} onChange={this.onChange} />;
  }

  saveImage() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.getViewManagerConfig('RSSignatureView').Commands.saveImage,
      [],
    );
  }

  resetImage() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.getViewManagerConfig('RSSignatureView').Commands.resetImage,
      [],
    );
  }
}

SignatureCapture.propTypes = {
  ...View.propTypes,
  rotateClockwise: PropTypes.bool,
  square: PropTypes.bool,
  saveImageFileInExtStorage: PropTypes.bool,
  viewMode: PropTypes.string,
  showBorder: PropTypes.bool,
  showNativeButtons: PropTypes.bool,
  showTitleLabel: PropTypes.bool,
  maxSize: PropTypes.number,
  minStrokeWidth: PropTypes.number,
  maxStrokeWidth: PropTypes.number,
  strokeColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  fileName: PropTypes.string,
};

const RSSignatureView = requireNativeComponent('RSSignatureView', SignatureCapture, {
  nativeOnly: { onChange: true },
});

module.exports = SignatureCapture;
