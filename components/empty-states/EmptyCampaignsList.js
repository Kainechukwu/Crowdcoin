import React from "react";

export default function EmptyCampaignsList() {
  return (
    <div className='py-2 max-w-max'>
     
      <div className="ui icon message ">
        <i className="exclamation triangle icon"></i>
        <div className="content">
          <div className="header">Nothing to see yet.</div>
          <p>Try adding a campaign</p>
        </div>
      </div>
    </div>
  );
}
