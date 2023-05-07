export default {
  selfClosing: true,
  attributes: {
    src: { type: String },
    alt: { type: String },
    caption: { type: String },
  },
  render: ({ src, alt = '', caption }: any) => (
    <figure>
      <img src={src} alt={alt} />
      <figcaption>{caption}</figcaption>
    </figure>
  ),
};
