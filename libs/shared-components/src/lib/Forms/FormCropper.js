import React, { useEffect, useRef  } from 'react';
import {ContentWrapper} from '../Layout/ContentWrapper';
import { Container, Row, Col } from 'reactstrap';
import $ from 'jquery';
// Image Cropper
import 'cropper/dist/cropper.css';
import 'cropper/dist/cropper.js';

const FormCropper = (props) => {
    const inputImage = useRef();
    const cropperImage = useRef();
    let inputElement;

    useEffect(() => {
      
         inputElement = $(inputImage.current); // upload button
        let cropperElement = $(cropperImage.current); // image for cropper
        let options = {
            aspectRatio: 16 / 9,
            preview: '.img-preview',
            crop: function(data) {
                // console.log(self.cropperElement.cropper('getCroppedCanvas').toDataURL()); // base64
                console.log('Data X: ' + (Math.round(data.x)));
                console.log('Data Y: ' + (Math.round(data.y)));
                console.log('Data Height: ' + (Math.round(data.height)));
                console.log('Data Width: ' + (Math.round(data.width)));
                console.log('Data Rotate: ' + (Math.round(data.rotate)));
            }
        }

           // init plugin
           cropperElement.cropper(options);

           // prepare to handle image upload
           handleNewImage();

           return () => {
            cropperElement.cropper('destroy');
           }
    },[])

    const handleNewImage=() =>{
        var self = props;
        var URL = window.URL || window.webkitURL,
            blobURL;

        if (URL) {
            inputElement.change(function() {
                var files = files,
                    file;

                if (!self.cropperElement.data('cropper')) {
                    return;
                }

                if (files && files.length) {
                    file = files[0];

                    if (/^image\/\w+$/.test(file.type)) {
                        blobURL = URL.createObjectURL(file);
                        self.cropperElement.one('built.cropper', function() {
                            URL.revokeObjectURL(blobURL); // Revoke when load complete
                        }).cropper('reset').cropper('replace', blobURL);
                        self.inputElement.val('');
                    } else {
                        alert('Please choose an image file.');
                    }
                }
            });
        } else {
            inputElement.parent().remove();
        }
    }
    return (
        <ContentWrapper>
            <div className="content-heading">
                <div>Image Cropper
                    <small>Simple image cropping plugin.</small>
                </div>
            </div>
            <Container>
                <Row>
                    <Col lg={ 8 }>
                        <div className="img-container mb-lg">
                            <img ref={cropperImage} src="img/mb-sample.jpg" alt="Sample" />
                        </div>
                    </Col>
                    <Col lg={ 4 }>
                        <div className="docs-preview clearfix">
                            <div className="img-preview preview-lg"></div>
                            <div className="img-preview preview-md"></div>
                            <div className="img-preview preview-sm"></div>
                            <div className="img-preview preview-xs"></div>
                        </div>
                    </Col>
                </Row>
                <Row className="mt">
                    <Col lg={ 4 }>
                        <label htmlFor="inputImage" title="Upload image file" className="btn btn-info btn-upload">
                            <input ref={inputImage} id="inputImage" name="file" type="file" accept="image/*" className="sr-only" />
                            <span title="Import image with Blob URLs" className="docs-tooltip">
                            Upload image
                            </span>
                        </label>
                    </Col>
                </Row>
            </Container>
        </ContentWrapper>
        );
}
export default FormCropper;