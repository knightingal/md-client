import * as React from 'react';
import {decryptArray} from '../lib/decryptoArray';


export class ImgComponent extends React.Component<{src: string, password: string}, {url: string | null}> {
    constructor(props:{src: string,  password: string}) {
        super(props);
        this.state = {
            url:null
        }
    }

    fetchImgByUrl(url: string) {
        console.log(`fetch img: ${url}`);
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
            src={this.state.url != null ? this.state.url : ""} 
            style={{display:"block", objectFit:"cover", height:"200px", width:"100%"}}
        />
    }
}