import * as React from 'react';
import { decryptArray } from '../lib/decryptoArray';

import { Flow1000ModelState } from '../models/flow1000';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { router } from "umi";

interface ImgComponentProps {
  index: number;
  src: string;
  password: string;
  mount: boolean;
  expandImgIndex: number;
  width: number;
  height: number;
  dispatch: Dispatch<any>;
  sectionIndex: number;
}

interface ImgComponentState {
  url: string | null;
  expand: boolean;
}

export default connect(({ flow1000 }: { flow1000: Flow1000ModelState }) => ({
  expandImgIndex: flow1000.expandImgIndex,
  password: flow1000.pwd,
}))(
  class ImgComponent extends React.Component<ImgComponentProps, ImgComponentState> {
    constructor(props: ImgComponentProps) {
      super(props);
      this.divRefs = React.createRef();
      this.state = {
        url: null,
        expand: props.expandImgIndex == this.props.index
      };
      this.lastTimestamp = -1;
    }
    divRefs: React.RefObject<HTMLImageElement>;
    lastTimestamp: number;
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

    componentDidUpdate(prevProps: { src: string; mount: boolean; expandImgIndex:number }) {
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

      if (this.props.expandImgIndex != prevProps.expandImgIndex) {
        this.setState({
          expand:this.props.expandImgIndex == this.props.index
        });
      }

      if (this.props.mount != prevProps.mount) {
        if (this.props.mount == true && this.props.src != null) {
            this.fetchImgByUrl(this.props.src);
        }       
      }
    }

    onMouseOver(e: React.MouseEvent) {
      console.log(this.divRefs);
      console.log(this.divRefs.current?.offsetWidth)
      this.lastTimestamp = e.timeStamp;
      setTimeout((timeStamp:number)=>{
        if (timeStamp == this.lastTimestamp) {
          this.props.dispatch({
            type: 'flow1000/imgMouseOver',
            imgIndex: this.props.index,
          });
        }
      }, 600, e.timeStamp);
    }
    onMouseLeave(e: React.MouseEvent) {
      this.lastTimestamp = e.timeStamp;
      this.props.dispatch({
        type: 'flow1000/imgMouseOver',
        imgIndex: -1,
      });
    }
    onMouseMove(e: React.MouseEvent) {
      this.lastTimestamp = e.timeStamp;
      setTimeout((timeStamp:number)=>{
        if (timeStamp == this.lastTimestamp) {
          this.props.dispatch({
            type: 'flow1000/imgMouseOver',
            imgIndex: this.props.index,
          });
        }
      }, 600, e.timeStamp);

    }
    onClick(e: React.MouseEvent) {
      this.lastTimestamp = e.timeStamp;
      this.props.dispatch({
        type: 'flow1000/imgClick',
        imgIndex: this.props.sectionIndex,
        index: this.props.index
      });

      router.push("/flow1000/sectionContent/")
    }

    render() {
      let imgHeight;
      if (this.divRefs.current != undefined) {
        imgHeight = `${this.props.height * this.divRefs.current.offsetWidth / this.props.width}px`; 
      } else {
        imgHeight = 'auto';
      }
      const height = this.state.expand ? imgHeight : '200px';
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
            onMouseMove={e => {
              this.onMouseMove(e);
            }}
            onMouseLeave={e => {
              this.onMouseLeave(e);
            }}
            onClick={e => {
              this.onClick(e);
            }}
          />
        ) : (
          <div style={{ height: '200px', width: '100%' }} />
        );
      return img;
    }
  },
);
