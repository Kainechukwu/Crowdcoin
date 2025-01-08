import React from "react";

export default function EmptyCampaignsList() {
  return (
    <div className='py-2 max-w-max'>
     
      <div class="ui icon message ">
        <i class="exclamation triangle icon"></i>
        <div class="content">
          <div class="header">Nothing to see yet.</div>
          <p>Try adding a campaign</p>
        </div>
      </div>
    </div>
  );
}
