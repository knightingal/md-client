import { HeightType } from "./LazyLoader";

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import ImgComponent from './SectionImgComponent';
import { AlbumConfig } from '../store';

function AlbumCoverCard(props: {
  title: string;
  imgSrc: string;
  sectionIndex: number;
  mount: boolean;
  index: number;
  coverHeight: number;
  coverWidth: number;
  timeStamp: string;
  album: string;
}) {
  return (
    <Card >
      <CardHeader title={props.title} subheader={props.timeStamp} sx={{ whiteSpace: "nowrap" }} />
      <ImgComponent
        sectionIndex={props.sectionIndex}
        src={props.imgSrc}
        password="yjmK14040842$000"
        mount={props.mount}
        index={props.index}
        height={props.coverHeight}
        width={props.coverWidth}
        album={props.album}
      />
      <CardActions disableSpacing={true}>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton aria-label="download">
          <DownloadIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}


export interface PicIndex {
  sectionIndex: number;
  name: string;
  cover: string;
  index: number;
  coverWidth: number;
  coverHeight: number;
  expanded: boolean;
  album: string;
}

class SectionInfo {
  imgSrc: string;
  title: string;
  timeStamp: string;
  index: number;
  sectionIndex: number;
  coverHeight: number;
  coverWidth: number;
  album: string;

  constructor(value: PicIndex, baseUrl: string, ecrypted: boolean) {
    this.imgSrc = `/linux1000/${baseUrl}/${value.name}/${value.cover}${ecrypted ? ".bin" : ""}`;
    this.title = value.name.substring(14);
    this.timeStamp = value.name.substring(0, 14);
    this.sectionIndex = value.sectionIndex;
    this.index = value.index;
    this.coverHeight = value.coverHeight;
    this.coverWidth = value.coverWidth;
    this.album = value.album;
  }
}


export class GridLineBean implements HeightType {
  height: number;
  expand: boolean;

  section0: SectionInfo;
  section1: SectionInfo | null;
  section2: SectionInfo | null;
  section3: SectionInfo | null;

  constructor(value0: PicIndex, value1: PicIndex | null, value2: PicIndex | null, value3: PicIndex | null, getConfig: (album: string) => AlbumConfig) {
    this.height = 360;
    this.expand = false;
    this.section0 = new SectionInfo(value0, getConfig(value0.album).baseUrl, getConfig(value0.album).encryped);
    this.section1 = value1 != null ? new SectionInfo(value1, getConfig(value1.album).baseUrl, getConfig(value1.album).encryped) : null;
    this.section2 = value2 != null ? new SectionInfo(value2, getConfig(value2.album).baseUrl, getConfig(value2.album).encryped) : null;
    this.section3 = value3 != null ? new SectionInfo(value3, getConfig(value3.album).baseUrl, getConfig(value3.album).encryped) : null;
  }
}
export const GridLine = (props: { item: GridLineBean; mount: boolean }) => {
  const section1 =
    props.item.section1 != null ? (
      <Grid item={true} xs={3}>
        <AlbumCoverCard
          album={props.item.section1.album}
          sectionIndex={props.item.section1.sectionIndex}
          index={props.item.section1.index}
          mount={props.mount}
          timeStamp={props.item.section1.timeStamp}
          title={props.item.section1.title}
          imgSrc={props.item.section1.imgSrc}
          coverHeight={props.item.section1.coverHeight}
          coverWidth={props.item.section1.coverWidth}
        />
      </Grid>
    ) : null;
  const section2 =
    props.item.section2 != null ? (
      <Grid item={true} xs={3}>
        <AlbumCoverCard
          album={props.item.section2.album}
          sectionIndex={props.item.section2.sectionIndex}
          index={props.item.section2.index}
          mount={props.mount}
          timeStamp={props.item.section2.timeStamp}
          title={props.item.section2.title}
          imgSrc={props.item.section2.imgSrc}
          coverHeight={props.item.section2.coverHeight}
          coverWidth={props.item.section2.coverWidth}
        />
      </Grid>
    ) : null;
  const section3 =
    props.item.section3 != null ? (
      <Grid item={true} xs={3}>
        <AlbumCoverCard
          sectionIndex={props.item.section3.sectionIndex}
          index={props.item.section3.index}
          mount={props.mount}
          timeStamp={props.item.section3.timeStamp}
          title={props.item.section3.title}
          imgSrc={props.item.section3.imgSrc}
          coverHeight={props.item.section3.coverHeight}
          coverWidth={props.item.section3.coverWidth}
          album={props.item.section3.album}
        />
      </Grid>
    ) : null;

  return (
    <div style={{ "height": "360px" }}>
      <Grid container={true} spacing={1} sx={{ marginTop: "auto" }}  >
        <Grid item={true} xs={3}>
          <AlbumCoverCard
            sectionIndex={props.item.section0.sectionIndex}
            index={props.item.section0.index}
            timeStamp={props.item.section0.timeStamp}
            mount={props.mount}
            title={props.item.section0.title}
            imgSrc={props.item.section0.imgSrc}
            coverHeight={props.item.section0.coverHeight}
            coverWidth={props.item.section0.coverWidth}
            album={props.item.section0.album}
          />
        </Grid>
        {section1}
        {section2}
        {section3}
      </Grid>
    </div>
  );
};