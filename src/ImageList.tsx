import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchImages, deleteImageAsync, toggleFavorite  } from './ImageSlice';
import styled from 'styled-components';
import { AppDispatch } from './store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';



const Container = styled.div`
  display: flex;
  width: 100%;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  padding: 20px;
  width: 75%;
  @media (max-width: 600px) {
    width: 60%;
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;



const ImageItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  cursor: pointer;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;

  @media (max-width: 600px) {
    height: 150px;
  }
`;

const ImageDetails = styled.div`
  padding: 20px;
  width: 25%;
  @media (max-width: 600px) {
    width: 40%;
  }
  margin-top: -100px;
`;

const LargeImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);

  @media (max-width: 600px) {
    height: 120px;
  }
`;


const DeleteButton = styled.button`
  background-color: transparent;
  color: black;
  border: 1px solid grey;
  border-radius: 5px;
  padding: 6px 0;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FavoriteButton = styled.button<{ isFavorited: boolean }>`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 15px;
  color: ${props => props.isFavorited ? 'red' : 'white'};
`;

const FileNameContainer = styled.div`
  display: flex;
  align-items: center;
`;



const ImageInfoTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;

  th, td {
    border-top: 1px solid lightgrey;
    border-left: none;
    border-right: none;
    text-align: left;
    padding-top: 8px;
    padding-bottom: 10px;
    padding-left: 0px;
    font-size: 15px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  th, td:last-child td, td {
    border-bottom: 1px solid lightgrey;
  }

  td {
    text-align: right;
    color: #black;
    font-weight: 700;
  }

  th {
    text-align: left;
    color: grey;
    font-weight: 700;
  }

  td {
    text-align: right;
    color: #black;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    th, td {
      display: block;
      width: 100%;
      text-align: left;
    }
  }
`;


const Header = styled.h3`
  font-size: 22px;
  font-weight: bold;
  color: black;
`;

const ImageNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  p {
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
`;



interface ImageListProps {
  activeTab: 'recentlyAdded' | 'favorited';
}

const ImageList: React.FC<ImageListProps> = ({ activeTab }) => {
  // Get the images, loading, and error states from the Redux store
  const images = useSelector((state: { images: { images: any[] } }) => state.images.images);
  const loading = useSelector((state: { images: { loading: boolean } }) => state.images.loading);
  const error = useSelector((state: { images: { error: string | null } }) => state.images.error);

  const dispatch = useDispatch<AppDispatch>();
  

  // Fetch the images when the component mounts
  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  // State for the selected image
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Filter the images based on the activeTab prop
  let filteredImages = activeTab === 'favorited' ? images.filter((image) => image.favorited) : images;

  const formatSizeInMB = (sizeInBytes: number) => {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(2) + ' MB';
  };

  // Function to handle deleting an image
  const handleDeleteImage = async (imageId: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await dispatch(deleteImageAsync(imageId));
        setSelectedImage(null);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const handleToggleFavorite = (imageId: string) => {
    dispatch(toggleFavorite(imageId));
  };
  

  return (
    <Container>
      <GridContainer>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {filteredImages.map((image) => (
          <ImageItem key={image.id} onClick={() => setSelectedImage(image)}>
            <StyledImage src={image.url} alt={image.filename} />
            <div>
            <p><strong>{image.filename}</strong></p>
            <p>{formatSizeInMB(image.sizeInBytes)}</p>
            </div>
          </ImageItem>
        ))}
      </GridContainer>
      {selectedImage && (
      <ImageDetails>
    <LargeImage src={selectedImage.url} alt={selectedImage.filename} />
    <ImageNameContainer>
    <p>
  <FileNameContainer>
  <strong style={{fontSize: '13px'}}>{selectedImage.filename}</strong>
      </FileNameContainer>
</p>
<p><FavoriteButton
      isFavorited={selectedImage.favorited}
      onClick={() => handleToggleFavorite(selectedImage.id)}
    >
      <FontAwesomeIcon
        icon={faHeart}
        color={selectedImage.favorited ? 'red' : 'white'}
        stroke="black"
        strokeWidth={selectedImage.favorited ? 0 : 8}
      />
    </FavoriteButton></p>
    </ImageNameContainer>
    <p style={{ marginTop: "-10px", fontSize: "13px"}}>{formatSizeInMB(selectedImage.sizeInBytes)}</p>

    <Header>Information</Header>
<ImageInfoTable>
  <tbody>
    <tr>
      <th>Uploaded by:</th>
      <td>{selectedImage.uploadedBy}</td>
    </tr>
    <tr>
      <th>Created:</th>
      <td> {new Date(selectedImage.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
    </tr>
    <tr>
      <th>Last modified:</th>
      <td>{selectedImage.uploadedBy}</td>
    </tr>
    <tr>
      <th>Dimensions:</th>
      <td>{selectedImage.dimensions.height} x {selectedImage.dimensions.width}</td>
    </tr>
    <tr>
      <th>Resolution:</th>
      <td>{selectedImage.resolution.height} x {selectedImage.resolution.width}</td>
    </tr>
  </tbody>
</ImageInfoTable>

{selectedImage.description ?
<>
  <Header>Description</Header>
  <p>{selectedImage.description}</p>
</>
: null
}
<DeleteButton onClick={() => handleDeleteImage(selectedImage.id)}>Delete</DeleteButton>
</ImageDetails>
)}
</Container>
  );
};

export default ImageList;
