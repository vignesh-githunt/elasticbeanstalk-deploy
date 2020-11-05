/**
 * @author @Sk_khaja_moulali-gembrill
 * @version V11.0
 */

import React from "react";
import CKEditor from "ckeditor4-react";

export const CkEditor = ({ data,onChange }) => {
  
  return (
    <div style={{ overflow: "auto" }}>
      <CKEditor
        data={data}
        onChange={onChange}
      />
    </div>
  );
};
