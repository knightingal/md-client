import * as React from 'react';
import {decryptArray} from '../lib/decryptoArray';

import { connect } from 'dva';
import { Dispatch } from 'redux';


export default connect(
)(
class ImgComponent extends React.Component<{index: number, src: string, password: string, mount:boolean, dispatch: Dispatch<any>}, {url: string | null}> {
    constructor(props:{index: number, src: string,  password: string, mount:boolean, dispatch: Dispatch<any>}) {
        super(props);
        this.state = {
            url:null
        }
    }

    fetchImgByUrl(url: string) {
        // console.log(`fetch img: ${url}`);
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
        if (this.props.src != null && this.props.mount == true) {
            this.fetchImgByUrl(this.props.src);
            this.setState({
                url: null
            });
        }

    }

    componentDidUpdate(prevProps: {src: string, mount:boolean}) {
        if (this.props.src !== prevProps.src && this.props.mount == true
            // || (this.props.mount == true && prevProps.mount == false)
            ) {
            if(this.props.src != null) {
                this.fetchImgByUrl(this.props.src);
                this.setState({
                    url: null
                });
            }
        }

        if (this.props.mount != prevProps.mount) {
            if (this.props.mount == false) {
                this.setState({
                    url: null
                });
            } else {
                if(this.props.src != null) {
                    this.fetchImgByUrl(this.props.src);
                    this.setState({
                        url: null
                    });
                }
            }
        }
    }

    onMouseOver(e:React.MouseEvent) {
        this.props.dispatch({
            type:'flow1000/imgMouseOver',
            imgIndex: this.props.index
        });
    }

    render() {
        const img = this.state.url != null ? 
        <img src={this.state.url} style={{display:"block", objectFit:"cover", height:"200px", width:"100%"}} onMouseOver={e=>{this.onMouseOver(e)}}/> 
        : <div style={{height:"200px", width:"100%"}}/>
        return img;
    }
}
)
