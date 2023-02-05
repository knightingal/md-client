import * as React from 'react';
import { decryptArray } from '../lib/decryptoArray';

import { Flow1000ModelState } from '../models/flow1000';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
// import { router } from "umi";
import { useNavigate } from "react-router-dom";

const Encrypted = true;

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

const ImgComponentFunc = (props: ImgComponentProps): JSX.Element => {
  let lastTimestamp = -1;
  const divRefs = React.useRef(null);
  console.log(`props.height=${props.height}`)

  const [state, setState] = React.useState<ImgComponentState>({
    url: null,
    expand: props.expandImgIndex == props.index
  });

  const navigate = useNavigate();


  const fetchImgByUrl = (url: string) => {
    console.log("fetch " + url);
    fetch(url)
      .then(response => {
        return response.arrayBuffer();
      })
      .then(arrayBuffer => {
        const decrypted = Encrypted ?
          decryptArray(arrayBuffer, props.password)
          : arrayBuffer;
        const objectURL = URL.createObjectURL(new Blob([decrypted]));
        setState({
          expand: state.expand,
          url: objectURL,
        });
      });
  }

  React.useEffect(() => {
    if (props.src != null && props.mount == true) {
      fetchImgByUrl(props.src);
    }
  }, [props.mount, props.src])

  React.useEffect(() => {
    setState({
      expand: props.expandImgIndex == props.index,
      url: state.url
    });
  }, [props.expandImgIndex])


  const onMouseOver = (e: React.MouseEvent) => {
    lastTimestamp = e.timeStamp;
    setTimeout((timeStamp: number) => {
      if (timeStamp == lastTimestamp) {
        props.dispatch({
          type: 'flow1000/imgMouseOver',
          imgIndex: props.index,
        });
      }
    }, 600, e.timeStamp);
  }
  const onMouseLeave = (e: React.MouseEvent) => {
    lastTimestamp = e.timeStamp;
    props.dispatch({
      type: 'flow1000/imgMouseOver',
      imgIndex: -1,
    });
  }
  const onMouseMove = (e: React.MouseEvent) => {
    lastTimestamp = e.timeStamp;
    setTimeout((timeStamp: number) => {
      if (timeStamp == lastTimestamp) {
        props.dispatch({
          type: 'flow1000/imgMouseOver',
          imgIndex: props.index,
        });
      }
    }, 600, e.timeStamp);
  }
  const onClick = (e: React.MouseEvent) => {
    lastTimestamp = e.timeStamp;

    navigate("/flow1000/content/" + props.sectionIndex)
  }

  let imgHeight: string;
  let imgHeightNum: number;
  let expandWidth;
  let top;
  let topNum: number;
  if (divRefs.current != undefined) {
    imgHeightNum = props.height * (divRefs.current as any).offsetWidth / props.width;
    imgHeight = `${imgHeightNum}px`;
    expandWidth = (divRefs.current as any).offsetWidth + "px";
    top = (divRefs.current as any).offsetTop + "px"
    topNum = (divRefs.current as any).offsetTop;
  } else {
    imgHeightNum = 0;
    imgHeight = 'auto';
    expandWidth = 'auto';
    top = 'auto';
    topNum = 0;

  }
  const height = state.expand && false ? imgHeight : '200px';
  const expandHeight = imgHeight;
  const img =
    state.url != null ? (
      <>
        <img
          src={state.url}
          ref={divRefs}
          style={{
            display: 'block',
            objectFit: 'cover',
            height: height,
            width: '100%',
            transition: 'height 0.5s',
          }}
          onMouseOver={e => {
            onMouseOver(e);
          }}
          onMouseMove={e => {
            onMouseMove(e);
          }}
          onClick={e => {
            onClick(e);
          }}
        />
        {
          state.expand ?
            <ExpandImg height={height} expandHeight={expandHeight} url={state.url} top={top} expandWidth={expandWidth} expandHeightNum={imgHeightNum} topNum={topNum} />
            : null
        }

      </>
    ) : (
      <div style={{ height: '200px', width: '100%' }} />
    );
  return img;

}

const ExpandImg = ({ height, expandHeight, url, top, expandWidth, expandHeightNum, topNum }: { top: string, topNum: number, url: string, height: string, expandHeight: string, expandWidth: string, expandHeightNum: number }) => {
  let [currentHeight, setCurrentHeight] = React.useState<string>(height)
  let [expandTop, setExpandTop] = React.useState<string>(top)

  React.useEffect(() => {
    setTimeout(() => {
      setExpandTop(
        (topNum - (expandHeightNum / 2 - 100)) + "px"
      )
      setCurrentHeight(expandHeight);
    }, 0)
  }, [])

  return <img
    src={url}
    style={{
      position: 'absolute',
      display: 'block',
      objectFit: 'cover',
      height: currentHeight,
      width: expandWidth,
      top: expandTop,
      transition: 'height  0.5s, top 0.5s',
    }}
  // onMouseLeave={e => {
  //   onMouseLeave(e);
  // }}
  // onClick={e => {
  //   onClick(e);
  // }}
  />;
}

interface ImgComponentState {
  url: string | null;
  expand: boolean;
}
const ConnCompFunc = connect(({ flow1000 }: { flow1000: Flow1000ModelState }) => ({
  expandImgIndex: flow1000.expandImgIndex,
}))(ImgComponentFunc);

const ConnCompClz = connect(({ flow1000 }: { flow1000: Flow1000ModelState }) => ({
  expandImgIndex: flow1000.expandImgIndex,
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
          const decrypted = Encrypted ?
            decryptArray(arrayBuffer, this.props.password)
            : arrayBuffer;
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

    componentDidUpdate(prevProps: { src: string; mount: boolean; expandImgIndex: number }) {
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
          expand: this.props.expandImgIndex == this.props.index
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
      setTimeout((timeStamp: number) => {
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
      setTimeout((timeStamp: number) => {
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
      });

      // router.push("/flow1000/sectionContent/")
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
  }
);


export default ConnCompFunc;