import * as React from 'react';
import { decryptArray } from '../lib/decryptoArray';
import { connect } from 'dva';
import { Flow1000ModelState } from '@/models/flow1000';
import { useState, useEffect } from 'react';

interface ImgComponentProp {
  src: string;
  height: number;
  width: number;
  password: string;
}

const ImgComponent = (props: ImgComponentProp) => {
  const [url, setUrl] = useState<string | null>(null);
  const fetchImgByUrl = (url: string) => {
    fetch(url)
      .then(response => {
        return response.arrayBuffer();
      })
      .then(arrayBuffer => {
        const decrypted = decryptArray(arrayBuffer, props.password);
        const objectURL = URL.createObjectURL(new Blob([decrypted]));
        setUrl(objectURL);
      });
  };
  useEffect(() => {
    if (props.src != null) {
      fetchImgByUrl(props.src);
      setUrl(null);
    }
  }, [props.src]);

  return (
    <img
      src={url == null ? '' : url}
      style={{ display: 'block', margin: 'auto' }}
      height={`${props.height}px`}
      width={`${props.width}px`}
    />
  );
};

export default connect(({ flow1000 }: { flow1000: Flow1000ModelState }) => {
  return { password: flow1000.pwd };
})(ImgComponent);
