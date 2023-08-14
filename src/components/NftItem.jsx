import React from "react";

const NftItem = ({ nft, style }) => {
  return (
    <div className="nft-container" style={style}>
      <img className="nft-image" src={nft.img} alt={nft.title} />
      <div className="nft-info">
        <h3 className="no-margin">{nft.title}</h3>
        <p className="no-margin"> {nft.price}$</p>
      </div>
    </div>
  );
};

export default React.memo(NftItem);
