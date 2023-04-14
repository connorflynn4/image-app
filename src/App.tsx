import React, { useState } from 'react';
import ImageList from './ImageList';
import styled from 'styled-components';

const ContentWrapper = styled.div`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const Title = styled.h1`
  margin-left: 20px;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  padding-left: 20px;
`;

const Tab = styled.button`
  background-color: transparent;
  border: none;
  padding: 10px 0px;
  font-size: 16px;
  cursor: pointer;
  border-bottom: 2px solid transparent;

  &:last-child {
    padding-left: 20px;
  }

  &:hover {
    color: #800080;
  }
`;

const ActiveTab = styled(Tab)`
  color: #800080;
  border-bottom-color: #800080;

  &:last-child {
    border-bottom-color: #800080;
  }
`;

const App = () => {
  const [activeTab, setActiveTab] = useState<'recentlyAdded' | 'favorited'>('recentlyAdded');

  return (
    <div>
      <ContentWrapper>
        <Title>Photos</Title>
        <TabsContainer>
          <Tab
            onClick={() => setActiveTab('recentlyAdded')}
            as={activeTab === 'recentlyAdded' ? ActiveTab : undefined}
          >
            Recently Added
          </Tab>
          <Tab
            onClick={() => setActiveTab('favorited')}
            as={activeTab === 'favorited' ? ActiveTab : undefined}
          >
            Favorited
          </Tab>
        </TabsContainer>
        <ImageList activeTab={activeTab} />
      </ContentWrapper>
    </div>
  );
};

export default App;
