interface BannerProps {
    banner: string;
}

function BannerPrincipal({ banner}: BannerProps) {
    return (
        <div className="flex items-center justify-between w-full h-[400px] my-6 bg-cover" style={{ backgroundImage: `url(${banner})` }}>
         
        </div>
    );
}
export default BannerPrincipal;