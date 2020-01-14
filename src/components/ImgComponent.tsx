import * as React from 'react';
import { decryptArray } from '../lib/decryptoArray';

import { Flow1000ModelState } from '../models/flow1000';
import { connect } from 'dva';
import { Dispatch } from 'redux';

interface ImgComponentProps {
  index: number;
  src: string;
  password: string;
  mount: boolean;
  expandImgIndex: number;
  width: number;
  height: number;
  dispatch: Dispatch<any>;
}

interface ImgComponentState {
  url: string | null;
}

export default connect(({ flow1000 }: { flow1000: Flow1000ModelState }) => ({
  expandImgIndex: flow1000.expandImgIndex,
}))(
  class ImgComponent extends React.Component<ImgComponentProps, ImgComponentState> {
    constructor(props: ImgComponentProps) {
      super(props);
      this.divRefs = React.createRef();
      this.state = {
        url: null,
      };
    }
    divRefs: React.RefObject<HTMLImageElement>;

    fetchImgByUrl(url: string) {
        fetch(url)
        .then(response => {
          return response.arrayBuffer();
        })
        .then(arrayBuffer => {
          const decrypted = decryptArray(arrayBuffer, this.props.password);
          const objectURL = URL.createObjectURL(new Blob([decrypted]));
          this.setState({
            url: objectURL,
          });
        });
    }

    componentDidMount() {
      if (this.props.src != null && this.props.mount == true) {
        this.fetchImgByUrl(this.props.src);
        this.setState({
          url: null,
        });
      }
    }

    componentDidUpdate(prevProps: { src: string; mount: boolean }) {
      if (
        this.props.src !== prevProps.src &&
        this.props.mount == true
      ) {
        if (this.props.src != null) {
          this.fetchImgByUrl(this.props.src);
          this.setState({
            url: null,
          });
        }
      }

      if (this.props.mount != prevProps.mount) {
        if (this.props.mount == false) {
          this.setState({
            url: null,
          });
        } else {
          if (this.props.src != null) {
            this.fetchImgByUrl(this.props.src);
            this.setState({
              url: null,
            });
          }
        }
      }
    }

    onMouseOver(e: React.MouseEvent) {
      console.log(this.divRefs);
      console.log(this.divRefs.current?.offsetWidth)
      this.props.dispatch({
        type: 'flow1000/imgMouseOver',
        imgIndex: this.props.index,
      });
    }
    onMouseLeave(e: React.MouseEvent) {
      this.props.dispatch({
        type: 'flow1000/imgMouseOver',
        imgIndex: -1,
      });
    }

    render() {
      let imgHeight;
      if (this.divRefs.current != undefined) {
        imgHeight = `${this.props.height * this.divRefs.current.offsetWidth / this.props.width}px`; 
      } else {
        imgHeight = 'auto';
      }
      const height = this.props.expandImgIndex == this.props.index ? imgHeight : '200px';
      const img =
        this.state.url != null ? (
          <img
            src={this.state.url}
            ref={this.divRefs}
            style={{
              display: 'block',
              objectFit: 'cover',
              height: height,
              width: '100%',
              transition: 'height 0.5s',
            }}
            onMouseOver={e => {
              this.onMouseOver(e);
            }}
            onMouseLeave={e => {
              this.onMouseLeave(e);
            }}
          />
        ) : (
          <div style={{ height: '200px', width: '100%' }} />
        );
      return img;
    }
  },
);
