import styled from 'styled-components';

export const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Note = styled.div`
  background-color: ${props => props.bgColor};
  padding: 20px;
  border-radius: 8px;
  min-height: 200px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    right: -5px;
    left: 5px;
    height: 5px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 0 0 8px 8px;
  }
`;

export const GridNote = styled(Note)`
  background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
`;

export const LinedNote = styled(Note)`
  background-image: linear-gradient(transparent 95%, rgba(0, 0, 0, 0.1) 95%);
  background-size: 100% 30px;
  line-height: 30px;
`;

export const TornNote = styled(Note)`
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 15px;
    background-image: linear-gradient(45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%),
                      linear-gradient(-45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%);
    background-size: 20px 40px;
    background-position: 0 -20px;
  }
`;

export const PostcardNote = styled(Note)`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  
  &::after {
    content: 'TO:';
    position: absolute;
    top: 20px;
    left: 20px;
    font-weight: bold;
  }
  
  &::before {
    content: 'FROM:';
    position: absolute;
    top: 80px;
    left: 20px;
    font-weight: bold;
  }
`; 