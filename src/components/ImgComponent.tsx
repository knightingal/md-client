import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { decryptArray } from '../lib/decryptoArray';
import { ConfigState } from '../store';

interface ImgComponentProps {
  src: string, height: number, width: number, password: string, album: string
}

const ImgComponentFunc = (props: ImgComponentProps) => {
  const albumConfigs = useSelector((state: {
    flow1000Config: ConfigState,
  }) => {
    return state.flow1000Config.albumConfigs;
  })
  let albumConfig = albumConfigs.find(config => config.name === props.album);
  if (!albumConfig) {
    albumConfig = albumConfigs[0]
  }

  const [url, setUrl] = useState<string | null>(null);
  const fetchImgByUrl = (url: string) => {
    fetch(url).then(response => {
      return response.arrayBuffer();
    }).then(arrayBuffer => {
      let decrypted: ArrayBuffer;
      if (albumConfig?.encrypted) {
        decrypted = decryptArray(arrayBuffer, props.password);
      } else {
        decrypted = arrayBuffer;
      }
      const objectURL = URL.createObjectURL(new Blob([decrypted]));
      setUrl(objectURL);
    });
  }

  useEffect(() => {
    if (props.src != null) {
      fetchImgByUrl(props.src);
      setUrl(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.src])

  return <img alt=""
    src={url == null ? "" : url}
    style={{ display: "block", margin: "auto" }}
    height={`${props.height}px`}
    width={`${props.width}px`}
  />

}

export default ImgComponentFunc;