export default function Video({ file }) {
  const temp = file.path.split('/');
  return (
    <div className="video">
      <video
        src={import.meta.env.VITE_API_ROUTE + '/video/' + temp[1]}
        controls
      >
        <source
          src={import.meta.env.VITE_API_ROUTE + '/video/' + temp[1]}
          type="video/mp4"
        />
      </video>
    </div>
  );
}
