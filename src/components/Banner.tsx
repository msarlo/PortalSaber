import Image, { StaticImageData } from "next/image"

interface BannerProps {
    title: string | StaticImageData;
    descricao?: string;
    type?: 'text' | 'image';
}

export function Banner({ title, descricao, type }: BannerProps) {
    const isImage = type === 'image' || typeof title !== 'string';

    return (
        <section className="bg-custom-blue py-16 
         shadow-[4px_4px_10px_0px_rgba(0,0,0,0.1)] mx-auto my-8 transform hover:scale-[1.01]
        transition-all duration-300">
            <div className="container mx-auto px-4">
                {!isImage ? (
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-4 text-gray-200">{title as string}</h1>
                        {descricao && <p className="text-xl max-w-3xl mx-auto text-gray-200">{descricao}</p>}
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                        <div className="flex-shrink-0">
                            <Image
                                className="max-w-[200px] md:max-w-[400px] h-auto"
                                src={title}
                                alt="Banner Title"
                                width={400}
                                height={200}
                            />
                        </div>
                        {descricao && <p className="text-xl text-white max-w-md">{descricao}</p>}
                    </div>
                )}
            </div>
        </section>
    )
}