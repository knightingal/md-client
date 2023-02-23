import * as React from 'react';
import { decryptArray } from '../lib/decryptoArray';

interface ImgComponentProps {
  src: string, height: number, width: number, password: string
}

const ImgComponentFunc = (props: ImgComponentProps) => {
  const [url, setUrl] = React.useState<string | null>(null);
  const fetchImgByUrl = (url: string) => {
    fetch(url).then(response => {
      return response.arrayBuffer();
    }).then(arrayBuffer => {
      const decrypted = decryptArray(arrayBuffer, props.password);
      // const decrypted = arrayBuffer;
      const objectURL = URL.createObjectURL(new Blob([decrypted]));
      setUrl(objectURL);
    });
  }

  React.useEffect(() => {
    if (props.src != null) {
      fetchImgByUrl(props.src);
      setUrl(null)
    }

  }, [props.src])
  return <img alt=""
    src={url == null ? "" : url}
    style={{ display: "block", margin: "auto" }}
    height={`${props.height}px`}
    width={`${props.width}px`}
  />

}

export default ImgComponentFunc;