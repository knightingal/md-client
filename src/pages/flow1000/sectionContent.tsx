
import React, { useEffect, useState } from 'react';
import { lazyLoader, LazyProps, HeightType, ParentCompHandler } from '../../components/LazyLoader';

import ImgComponent from '../../components/ImgComponent';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AlbumConfig, ConfigState, RootState, setTitle, useAppDispatch } from '../../store';

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

const Content = () => {
  const { sectionId } = useParams();
  const dispatch = useAppDispatch();


  const {height } = useSelector((state: RootState) => ({
    height: state.flow1000Content.height
  }))

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
    name: '', encrypted: false, baseUrl: ""
  })


  useEffect(() => {
    ((index: number) => {
      if (index <= 0) {
        return;
      }
      fetch(`/local1000/picDetailAjax?id=${index}`)
        .then((resp: Response) => {
          return resp.json();
        })
        .then((json: any) => {
          const sectionDetail: SectionDetail = json;
          const title = sectionDetail.dirName;
          dispatch(setTitle({title, index, displaySyncBtn: true}));
          setSectionDetail(sectionDetail);
          let albumConfig = albumConfigs.find(config => config.name === sectionDetail.album);
          if (!albumConfig) {
            albumConfig = albumConfigs[0]
          }
          setAlbumConfig(albumConfig);
        });
    })(Number(sectionId));
  }, [sectionId, albumConfigs, dispatch])

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


  const ImgComponentItem = (props: {mount: boolean, item: ImgDetail}) => {
    return <ImgComponent
      album={sectionDetail.album}
      width={props.item.width}
      height={props.item.height}
      src={`/linux1000/${albumConfig.baseUrl}/${sectionDetail.dirName}/${props.item.name}${albumConfig.encrypted ? ".bin" : ""}`}
      password="yjmK14040842$000"
    />
  }

  const LazyLoader: React.ComponentClass<LazyProps<
    ImgDetail
  >> = lazyLoader(ImgComponentItem, "Content", 2)

  return <div ref={divRefs}>
    <LazyLoader dispatchHandler={prarentCompHandler}
      height={height - 64} dataList={sectionDetail.pics} scrollTop={0} />
  </div>
}


export default Content;

