import * as React from 'react';
import {decryptArray} from '../lib/decryptoArray';
import { connect } from 'dva';
import { Flow1000ModelState } from '@/models/flow1000';

export default connect(({ flow1000 }: { flow1000: Flow1000ModelState }) => {
  return { password: flow1000.pwd, };
}) (
class ImgComponent extends React.Component<{src: string, height: number, width: number, password: string}, {url: string|null}> {
    constructor(props:{src: string, height: number, width: number, password: string}) {
        super(props);
        this.state = {
            url:null
        }
    }

    fetchImgByUrl(url: string) {
        fetch(url).then(response => {
            return response.arrayBuffer();
        }).then(arrayBuffer => {
            const decrypted = decryptArray(arrayBuffer, this.props.password);
            const objectURL = URL.createObjectURL(new Blob([decrypted]));
            this.setState({
                url: objectURL,
            });
        });
    }

    componentDidMount() {
        if (this.props.src != null) {
            this.fetchImgByUrl(this.props.src);
            this.setState({
                url: null
            });
        }

    }

    componentDidUpdate(prevProps: {src: string}) {
        if (this.props.src !== prevProps.src) {
            if(this.props.src != null) {
                this.fetchImgByUrl(this.props.src);
                this.setState({
                    url: null
                });
            }
        }
    }

    render() {
        return <img 
            src={this.state.url==null?"":this.state.url} 
            style={{display:"block", margin:'auto' }}
            height={`${this.props.height}px`} 
            width={`${this.props.width}px`}
        />
    }
}
)