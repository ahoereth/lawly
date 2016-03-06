import React, { PropTypes } from 'react';


const Norm = ({ data }) => {
  let level = data.enumeration.split('.').length + 1;
  level = data.enumeration === '1' ? 1 : (level > 6 ? 6 : level);
  level = `h${level}`;

  let children = [<span key='title'>{data.title}</span>];
  if (data.enumeration === '1') {
    children.unshift(
      <small style={{display: 'block'}} key='key'>({data.groupkey})</small>
    );
  }

  return (
    <div className='norm'>
      {React.createElement(level, {children})}
      <div  dangerouslySetInnerHTML={{__html: data.body}} />
      <div  dangerouslySetInnerHTML={{__html: data.foot}} />
    </div>
  );
};

Norm.propTypes = {
  data: PropTypes.object,
};


export default Norm;
