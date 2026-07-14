const PageNotFound = () => {
  function goBack() {
    window.location.href = '/';
  }

  return ( 
    <div className="w-100 vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="d-flex flex-column align-items-center justify-content-center gap-3">
        <div className="text-center bg-color-primary p-3 br-primary fw-bolder text-white" style={{fontSize:'80px', transform:'skew(-20deg, 0deg)'}}>404</div>
        <h1 className="text-uppercase">Sorry!, Page Not Found</h1>
        <button className="btn btn-outline-secondary" type="button" onClick={goBack}>Back To Home</button>
      </div>
    </div>
  );
}

export default PageNotFound;