export const fetchNFTs = async (limit, offset, collectionSymbol) => {
    try {
      const response = await fetch(
        `https://api-mainnet.magiceden.io/idxv2/getListedNftsByCollectionSymbol?collectionSymbol=${collectionSymbol}&limit=${limit}&offset=${offset}`
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      return [];
    }
  };