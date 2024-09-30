

// function RootLayout({ children }) {
//   return (
//     <div className="flex gap-5">
      
//       <main className="max-w-5xl flex-1 mx-auto py-4">{children}</main>
//     </div>
//   );
// }

// export default RootLayout;

import PropTypes from 'prop-types';

function RootLayout({ children }) {
  return (
    <div className="flex gap-5">
      <main className="max-w-5xl flex-1 mx-auto py-4">{children}</main>
    </div>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RootLayout;
