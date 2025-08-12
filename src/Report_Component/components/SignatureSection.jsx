import React from 'react';

const SignatureSection = () => {
  return (
    <div className="mt-4 pt-4 border-top">
      <div className="row">
        <div className="col-md-4 text-center">
          <div className="mb-3">
            <strong>Parent/Guardian Signature</strong>
          </div>
          <div className="border-bottom border-dark mb-2" style={{ height: '2px' }}></div>
          <small className="text-muted">Date: ________________</small>
        </div>
        
        <div className="col-md-4 text-center">
          <div className="mb-3">
            <strong>School Principal Signature</strong>
          </div>
          <div className="border-bottom border-dark mb-2" style={{ height: '2px' }}></div>
          <small className="text-muted">Date: ________________</small>
        </div>
        
        <div className="col-md-4 text-center">
          <div className="mb-3">
            <strong>Organization Head Signature</strong>
          </div>
          <div className="border-bottom border-dark mb-2" style={{ height: '2px' }}></div>
          <small className="text-muted">Date: ________________</small>
        </div>
      </div>
    </div>
  );
};

export default SignatureSection;
