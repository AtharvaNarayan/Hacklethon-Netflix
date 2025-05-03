import React from 'react';

const features = [
  {
    title: "Enjoy on your TV",
    description: "Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.",
    image: "https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png"
  },
  {
    title: "Download your shows to watch offline",
    description: "Save your favorites easily and always have something to watch.",
    image: "https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg"
  },
  {
    title: "Watch everywhere",
    description: "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.",
    image: "https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/device-pile.png"
  },
  {
    title: "Create profiles for kids",
    description: "Send kids on adventures with their favorite characters in a space made just for them — free with your membership.",
    image: "https://occ-0-2794-2219.1.nflxso.net/dnm/api/v6/19OhWN2dO19C9txTON9tvTFtefw/AAAABfpnX3dbgjZ-Je8Ax3xn0kXehZm_5L6-xe6YSTq_ucht9TI5jwDMqusWZKNYT8DfGudD0_wWVVTFLiN2_kaQJumz2iivUWbIbAtF.png"
  }
];

function Features() {
  return (
    <div className="py-12">
      {features.map((feature, index) => (
        <div key={index} className={`flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto py-12 px-4 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
          <div className="flex-1 text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{feature.title}</h2>
            <p className="text-lg md:text-xl">{feature.description}</p>
          </div>
          <div className="flex-1">
            <img src={feature.image} alt={feature.title} className="w-full max-w-md mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Features; 