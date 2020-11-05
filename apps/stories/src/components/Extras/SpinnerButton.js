import React from 'react'
import { Button,Spinner } from "reactstrap";
const SpinnerButton = ({children, loading, ...rest}) => { 
 return(
  <Button {...rest} > 
      {loading && (
        <Spinner
        as="span"
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
      />
      )}
      {loading && <span>Loading..</span>}
      {!loading && <span>{children}</span>}
    </Button>
 )
}
export default SpinnerButton;
