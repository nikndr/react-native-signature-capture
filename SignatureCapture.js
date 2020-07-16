

const ReactNative = require('react-native');
const React = require('react');
const PropTypes = require('prop-types');

const {
  requireNativeComponent, View, UIManager, DeviceEventEmitter,
} = ReactNative;

class SignatureCapture extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.subscriptions = [];
  }

  onChange(event) {
    if (event.nativeEvent.pathName) {
      if (!this.props.onSaveEvent) {
        return;
      }
      this.props.onSaveEvent({
        pathName: event.nativeEvent.pathName,
        encoded: event.nativeEvent.encoded,
        pathNameTrimmed: event.nativeEvent.pathNameTrimmed,
        encodedTrimmed: event.nativeEvent.encodedTrimmed,
        width: event.nativeEvent.width,
        height: event.nativeEvent.height,
      });
    }

    if (event.nativeEvent.dragged) {
      if (!this.props.onDragEvent) {
        return;
      }
      this.props.onDragEvent({
        dragged: event.nativeEvent.dragged,
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
            ReactNative.findNodeHandle(this),
            UIManager.getViewManagerConfig('RSSignatureView').Commands.saveImage,
            [],
        );
    }

    resetImage() {
        UIManager.dispatchViewManagerCommand(
            ReactNative.findNodeHandle(this),
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
