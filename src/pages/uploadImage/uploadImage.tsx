/* eslint-disable */
import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import blobStorageService from '../../utils/variables';

const { BlobServiceClient } = require("@azure/storage-blob");

interface UploadImageProps {
  match?: any;
}

const UploadImage: FC<UploadImageProps> = ({ match }) => {
  const containerName = "dgverse-public-image";
  const blobServiceClient = new BlobServiceClient(`${blobStorageService.hostname}${blobStorageService.sas}`);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  let { id, type, cover } = useParams();
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  }

  const formSubmit = async (e: any) => {
    e.preventDefault();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const content = "Hello world!";
    const blobName = "newblob" + new Date().getTime();

    let uploadBlobResponse;
    if (cover === 'true') {
      const blockBlobClient = containerClient.getBlockBlobClient(`public\\uploads\\${type}\\${id}\\cover_pic\\${fileName}`);
      uploadBlobResponse = await blockBlobClient.uploadBrowserData(file);
    } else {
      const blockBlobClient1 = containerClient.getBlockBlobClient(`public\\uploads\\${type}\\${id}\\display_pic\\${fileName}`);
      const blockBlobClient2 = containerClient.getBlockBlobClient(`public\\uploads\\${type}\\${id}\\icon\\${fileName}`);
      const blockBlobClient3 = containerClient.getBlockBlobClient(`public\\uploads\\${type}\\${id}\\thumbnail\\${fileName}`);
      uploadBlobResponse = await blockBlobClient1.uploadBrowserData(file);
      uploadBlobResponse = await blockBlobClient2.uploadBrowserData(file);
      uploadBlobResponse = await blockBlobClient3.uploadBrowserData(file);
    }
    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    console.log(file)
  }


  return (
    <form onSubmit={formSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button>Submit and check the console</button>
    </form>
  )
};

export default UploadImage;
