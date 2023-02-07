import * as React from 'react';
import { decryptArray } from '../lib/decryptoArray';

import { Flow1000ModelState } from '../models/flow1000';
import { connect, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { useNavigate } from "react-router-dom";

const Encrypted = true;


const ImgComponentFunc = (props: InnerImgComponentProps): JSX.Element => {
  const divRefs = React.useRef(null);
  console.log(`props.height=${props.height}`)

  const [state, setState] = React.useState<ImgComponentState>({
    url: null,
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
          url: objectURL,
        });
      });
  }

  React.useEffect(() => {
    if (props.src != null && props.mount == true) {
      fetchImgByUrl(props.src);
    }
  }, [props.mount, props.src])

  const onMouseOver = (e: React.MouseEvent) => {
    props.dispatch({
      type: 'flow1000/imgMouseOver',
      imgIndex: props.index,
    });
  }

  const onMouseMove = (e: React.MouseEvent) => {
    props.dispatch({
      type: 'flow1000/imgMouseOver',
      imgIndex: props.index,
    });
  }

  const onClick = (e: React.MouseEvent) => {
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

  const height = props.expanded && false ? imgHeight : '200px';
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
          props.expanded ?
            <ExpandImg
              index={props.index}
              height={height}
              expandHeight={expandHeight}
              url={state.url}
              top={top}
              expandWidth={expandWidth}
              expandHeightNum={imgHeightNum} topNum={topNum}
            />
            : null
        }

      </>
    ) : (
      <div style={{ height: '200px', width: '100%' }} />
    );
  return img;

}

const ExpandImg = ({
  height,
  expandHeight,
  url,
  top,
  expandWidth,
  expandHeightNum,
  topNum,
  index
}: {
  index: number,
  top: string,
  topNum: number,
  url: string,
  height: string,
  expandHeight: string,
  expandWidth: string,
  expandHeightNum: number,
}) => {
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

  const dispacther = useDispatch();

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
    onMouseLeave={e => {
      setExpandTop(top);
      setCurrentHeight(height);
      setTimeout(() => {
        dispacther({
          type: 'flow1000/imgMouseLeave',
          imgIndex: index,
        });

      }, 500);

    }}
  // onClick={e => {
  //   onClick(e);
  // }}
  />;
}

interface ImgComponentState {
  url: string | null;
}

interface ImgComponentProps {
  index: number;
  src: string;
  password: string;
  mount: boolean;
  width: number;
  height: number;
  sectionIndex: number;
}

interface InnerImgComponentProps extends ImgComponentProps {
  expanded: boolean;
  dispatch: Dispatch<any>;
}


const ConnCompFunc = connect(({ flow1000 }: { flow1000: Flow1000ModelState }, ownProps: ImgComponentProps) => ({
  expanded: flow1000.sectionList[ownProps.index].expanded,
}))(ImgComponentFunc);

export default ConnCompFunc;