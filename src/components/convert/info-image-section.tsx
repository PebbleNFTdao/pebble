interface Props {
  title: string;
  description: string;
  imageName: string;
  altText: string;
}

export default function InfoImageSection({
  title,
  description,
  imageName,
  altText,
}: Props) {
  return (
    <div className="flex py-2 md:py-6 max-w-[450px] md:max-w-[600px] flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0">
      <img
        width={170}
        height={190}
        src={imageName}
        alt={altText}
        className="w-[170px] h-[190px] object-cover"
      />
      <div className="pl-6">
        <h1 className="text-lg md:text-2xl pb-2 text-center md:text-left">
          {title}
        </h1>
        <p className="text-sm md:text-base">{description}</p>
      </div>
    </div>
  );
}
