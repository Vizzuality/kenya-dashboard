import React from 'react';
import PropTypes from 'prop-types';

// Components
import { Link } from 'routes';
import Icon from 'components/ui/icon';

export default class PrintPreview extends React.Component {
  render() {
    const { url, pdfUrl, imageUrl } = this.props;
    return (
      <div>
        <iframe
          src={url}
          width="100%"
          height="570px"
          frameBorder="0"
        />

        <div
          style={{
            paddingBottom: '30px'
          }}
        >
          <div className="row align-center">
            <div className="column shrink">
              <Link route={pdfUrl}>
                <a className="c-button -secondary" download>
                  Download as PDF
                </a>
              </Link>
            </div>

            <div className="column shrink">
              <Link route={imageUrl}>
                <a className="c-button -secondary" download>
                  Download as Image
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PrintPreview.propTypes = {
  url: PropTypes.string,
  pdfUrl: PropTypes.string,
  imageUrl: PropTypes.string
};
