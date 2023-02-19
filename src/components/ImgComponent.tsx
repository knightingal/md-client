import * as React from 'react';
import { decryptArray } from '../lib/decryptoArray';


export default class ImgComponent extends React.Component<{ src: string, height: number, width: number, password: string }, { url: string | null }> {
  constructor(props: { src: string, height: number, width: number, password: string }) {
    super(props);
    this.state = {
      url: null
    }
  }

  fetchImgByUrl(url: string) {
    fetch(url).then(response => {
      return response.arrayBuffer();
    }).then(arrayBuffer => {
      const decrypted = decryptArray(arrayBuffer, this.props.password);
      // const decrypted = arrayBuffer;
      const objectURL = URL.createObjectURL(new Blob([decrypted]));
      this.setState({
        url: objectURL,
      });
    });
  }

  componentDidMount() {
    if (this.props.src != null) {
      this.fetchImgByUrl(this.props.src);
      this.setState({
        url: null
      });
    }

  }

  componentDidUpdate(prevProps: { src: string }) {
    if (this.props.src !== prevProps.src) {
      if (this.props.src != null) {
        this.fetchImgByUrl(this.props.src);
        this.setState({
          url: null
        });
      }
    }
  }

  render() {
    return <img alt=""
      src={this.state.url == null ? "" : this.state.url}
      style={{ display: "block", margin: "auto" }}
      height={`${this.props.height}px`}
      width={`${this.props.width}px`}
    />
  }
}