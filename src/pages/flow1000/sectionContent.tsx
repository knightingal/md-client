
import React, { useEffect, useState } from 'react';
import { lazyLoader, LazyProps, HeightType, ParentCompHandler } from '../../components/LazyLoader';

import ImgComponent from '../../components/ImgComponent';
import { Flow1000ModelState } from '../../models/flow1000';
import { connect, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AlbumConfig, ConfigState } from '../../store';

class SectionDetail {
  dirName: string;
  picPage: string;
  pics: Array<ImgDetail>;
  album: string;

  constructor() {
    this.dirName = "";
    this.picPage = "";
    this.pics = [];
    this.album = "";
  }
}

class ImgDetail implements HeightType {
  name: string;
  width: number;
  height: number;

  constructor(name: string, width: number, height: number) {
    this.name = name;
    this.width = width;
    this.height = height;
  }
}

const Content = (props: { password: string, height: number }) => {
  const { sectionId } = useParams();

  const divRefs = React.useRef<HTMLDivElement>(null);

  const albumConfigs = useSelector((state: {
    flow1000Config: ConfigState,
  }) => {
    return state.flow1000Config.albumConfigs;
  })

  const prarentCompHandler: ParentCompHandler = {
    refreshScrollTop: (_: number) => void {
    },
    inScrolling: (_: boolean) => void {
    }
  }

  const [sectionDetail, setSectionDetail] = useState<SectionDetail>(new SectionDetail())
  const [albumConfig, setAlbumConfig] = useState<AlbumConfig>({
    name: '', encryped: false, baseUrl: ""
  })

  const fecthSectionList = (index: number) => {
    if (index <= 0) {
      return;
    }
    fetch(`/local1000/picDetailAjax?id=${index}`)
      .then((resp: Response) => {
        return resp.json();
      })
      .then((json: any) => {
        const sectionDetail: SectionDetail = json;
        setSectionDetail(sectionDetail);
        let albumConfig = albumConfigs.find(config => config.name === sectionDetail.album);
        if (!albumConfig) {
          albumConfig = albumConfigs[0]
        }
        setAlbumConfig(albumConfig);
      });
  }

  useEffect(() => {
    fecthSectionList(Number(sectionId));
  }, [sectionId])

  if (!divRefs.current) {
    return <div ref={divRefs} />
  }
  console.log("client width:")
  console.log(divRefs.current.clientWidth);
  const maxWidth = divRefs.current.clientWidth;

  sectionDetail.pics = sectionDetail.pics.map(pic => {
    if (pic.width <= maxWidth) {
      return pic;
    } else {
      const width = maxWidth
      const height = pic.height * maxWidth / pic.width
      return new ImgDetail(pic.name, width, height)
    }
  })


  const ImgComponentItem = (props: { mount: boolean, item: ImgDetail }) => {
    return <ImgComponent
      album={sectionDetail.album}
      width={props.item.width}
      height={props.item.height}
      src={`/linux1000/${albumConfig.baseUrl}/${sectionDetail.dirName}/${props.item.name}${albumConfig.encryped ? ".bin" : ""}`}
      password="yjmK14040842$000"
    />
  }

  const LazyLoader: React.ComponentClass<LazyProps<
    ImgDetail
  >> = lazyLoader(ImgComponentItem, "Content", 2)

  return <div ref={divRefs}>
    <LazyLoader dispatchHandler={prarentCompHandler}
      height={props.height - 64} dataList={sectionDetail.pics} scrollTop={0} />
  </div>
}


export default connect(({ flow1000 }: { flow1000: Flow1000ModelState }) => {
  const props = {
    height: flow1000.height,
    password: ""
  }
  return props;
})(Content);

