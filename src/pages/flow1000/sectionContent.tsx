
import React, { useEffect, useState } from 'react';
import { lazyLoader, LazyProps, HeightType, ParentCompHandler } from '../../components/LazyLoader';

import ImgComponent from '../../components/ImgComponent';
import { Flow1000ModelState } from '../../models/flow1000';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
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

const ContentFunc = (props: { password: string, height: number }) => {
  const { sectionId } = useParams();

  return <Content index={Number(sectionId)} password={props.password} height={props.height} />

}

class Content extends React.Component<{ index: number, password: string, height: number }, { sectionDetail: SectionDetail, scrollTop: number }> implements ParentCompHandler {
  constructor(props: { index: number, password: string, height: number }) {
    super(props);
    this.state = { sectionDetail: new SectionDetail(), scrollTop: 0 };
  }

  inScrolling: (inScrolling: boolean) => void = () => { }

  refreshScrollTop: () => void = () => { };

  fecthSectionList(index: number) {
    if (index <= 0) {
      return;
    }
    fetch(`/local1000/picDetailAjax?id=${index}`)
      .then((resp: Response) => {
        return resp.json();
      })
      .then((json: any) => {
        const sectionDetail: SectionDetail = json;
        this.setState({
          sectionDetail: sectionDetail,
          scrollTop: 0
        });
      });
  }

  componentDidMount() {
    this.fecthSectionList(this.props.index);
  }


  componentDidUpdate(prevProps: { index: number }) {
    if (this.props.index !== prevProps.index) {
      this.fecthSectionList(this.props.index);
    }

  }

  ImgComponentItem = (props: { mount: boolean, item: ImgDetail, parentComp: Content | ((props: any) => JSX.Element) }) => {
    return <ImgComponent
      album={this.state.sectionDetail.album}
      width={props.item.width}
      height={props.item.height}
      src={`/linux1000/encrypted/${(props.parentComp as Content).state.sectionDetail.dirName}/${props.item.name}.bin`}
      password="yjmK14040842$000"
    />
  }

  LazyLoader: React.ComponentClass<LazyProps<
    ImgDetail,
    { index: number, password: string },
    {},
    Content
  >> = lazyLoader(this.ImgComponentItem, "Content", 2)

  render() {
    return <this.LazyLoader dispatchHandler={this} height={this.props.height - 64} dataList={this.state.sectionDetail.pics} parentComp={this} scrollTop={this.state.scrollTop} />
  }
};

export default connect(({ flow1000 }: { flow1000: Flow1000ModelState }) => {
  const props = {
    height: flow1000.height,
    password: ""
  }
  return props;
})(ContentFunc);

