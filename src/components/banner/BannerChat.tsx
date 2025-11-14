interface BannerProps {
    banner: string;
 
}

function BannerChat({ banner}: BannerProps) {
    return (
        <div className="flex items-center justify-between w-[60%] h-[300px] my-6 bg-cover" style={{ backgroundImage: `url(${banner})` }}>
          
        </div>
    );
}
export default BannerChat;