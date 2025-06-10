import React from "react";
import noRecord from "../../public/no-record.png";

function NoRecordFound() {
  return (
    <div>
      <div
        className="flex flex-1 items-center py-3 mt-2 justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <img className="h-[200px]" src={noRecord} alt="" />
          <h3 className="text-2xl font-bold tracking-tight text-red-500">
            No Record Found!
          </h3>
          
        </div>
      </div>
    </div>
  );
}

export default NoRecordFound;
