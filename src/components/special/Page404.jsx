import PropTypes from 'prop-types';

export default function Page404({ messege = "The page you are looking for is not available." }) {
  return (
    <section className="page_404 h-screen bg-white">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="col-sm-10 col-sm-offset-1 text-center">
              <div className="four_zero_four_bg">
              </div>
              <div className="contant_box_404">
                <h3 className="text-6xl py-2">
                  Looks like you&apos;re lost
                </h3>
                <p className='py-4'>{messege}</p>
                <p onClick={()=>{
                  window.history.back();
                }} className="cursor-pointer">Go back</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

Page404.propTypes = {
  messege: PropTypes.string
}