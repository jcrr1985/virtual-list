import React, { useState, useEffect, useRef } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import SearchBar from "./SearchBar";
import Swal from "sweetalert2";
import { fetchNFTs } from "./../api";
import NftItem from "./NftItem";

const NftList = () => {
  function duplicateArray(array, times) {
    let duplicatedArray = [];
    for (let i = 0; i < times; i++) {
      duplicatedArray = duplicatedArray.concat(array);
    }
    return duplicatedArray;
  }

  const randomPrice = () => Math.floor(Math.random() * (1000 - 100 + 1)) + 100;

  const randomValue = () => Math.floor(Math.random() * 7) + 1;

  const [nfts, setNFTs] = useState(
    duplicateArray(
      Array.from({ length: 100 }, (_, index) => ({
        img: `/images/b${randomValue()}.png`,
        title: `Nft ${randomValue()}`,
        price: randomPrice(),
        id: index,
      })),
      100
    )
  );
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef(null);

  const loadMoreNFTs = async (startIndex, endIndex) => {
    if (!loading && hasMore) {
      setLoading(true);
      try {
        const nextNFTs = await fetchNFTs(endIndex - startIndex, startIndex);
        setNFTs((prevNFTs) => [...prevNFTs, ...nextNFTs]);
        setLoading(false);
        if (nextNFTs.length === 0) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setLoading(false);
      }
    }
  };

  const calculateContainerHeight = () => {
    if (containerRef.current) {
      const windowHeight = window.innerHeight;
      const searchBarHeight =
        containerRef.current.querySelector(".search-bar").offsetHeight;
      const calculatedContainerHeight = windowHeight - searchBarHeight;
      setContainerHeight(calculatedContainerHeight);
    }
  };

  const calculateRowHeight = () => {
    const numRows = 4;
    const calculatedRowHeight = Math.floor(containerHeight / numRows);
    return calculatedRowHeight;
  };

  useEffect(() => {
    const numColumns = 5;
    const numRows = 4;
    const initialLoadCount = numColumns * numRows;

    loadMoreNFTs(0, initialLoadCount);
    calculateContainerHeight();
    window.addEventListener("resize", calculateContainerHeight);

    return () => {
      window.removeEventListener("resize", calculateContainerHeight);
    };
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = nfts.filter((nft) =>
      nft.title.toLowerCase().includes(searchTerm)
    );
    setFilteredNFTs(filtered);
    if (filtered.length === 0 && searchTerm) {
      Swal.fire({
        icon: "error",
        title: "No NFTs match the search",
      });
    }
  };

  const displayNFTs = searchTerm.length > 0 ? filteredNFTs : nfts;

  return (
    <div>
      <div className="search-bar-container" ref={containerRef}>
        <SearchBar searchTerm={searchTerm} onSearchTermChange={handleSearch} />
      </div>
      <div className="auto-sizer-container">
        <AutoSizer>
          {({ height, width }) => {
            const numColumns = 5;
            const rowHeight = calculateRowHeight();
            const numRows = Math.floor(containerHeight / rowHeight);
            const gridHeight = numRows * rowHeight;
            return (
              <Grid
                height={gridHeight}
                width={width}
                columnCount={numColumns}
                rowCount={Math.ceil(displayNFTs.length / numColumns)}
                columnWidth={width / numColumns}
                rowHeight={rowHeight - 5}
                itemData={displayNFTs}
                onItemsRendered={({
                  visibleRowStartIndex,
                  visibleRowStopIndex,
                }) => {
                  const visibleNFTStartIndex =
                    visibleRowStartIndex * numColumns;
                  const visibleNFTStopIndex =
                    visibleRowStopIndex * numColumns + numColumns;
                  loadMoreNFTs(visibleNFTStartIndex, visibleNFTStopIndex);
                }}
              >
                {({ columnIndex, rowIndex, style }) => {
                  const index = rowIndex * numColumns + columnIndex;
                  const nft = displayNFTs[index];

                  if (!nft) {
                    return null;
                  }

                  return <NftItem key={nft.id} nft={nft} style={style} />;
                }}
              </Grid>
            );
          }}
        </AutoSizer>
        {loading && <p>Loading...</p>}
        {!hasMore && <p>No more NFTs to load.</p>}
        {searchTerm && displayNFTs.length === 0 && (
          <p>No NFTs match the search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default NftList;
