import { useState} from 'react'
import style from "./OurService.module.css"

const OurService = () => {

  const [expandedService, setExpandedService] = useState(null);

  // Function to handle service expansion
  const handleClick = (index) => {
    setExpandedService(expandedService === index ? null : index);
  };

  return (
    <section className={style.services}>
      <h2>Our Services <span>____</span></h2>
      <p>
        From routine checkups to complex repairs, we’re committed to delivering efficient solutions that ensure your car runs smoothly and safely for years to come.
      </p>
      <div className="row justify-content-center g-4">
        {[
          {
            icon: "🚀",
            title: "Performance Upgrade",
            sub: "At Abe-Garage, we specialize in elevating your vehicle's performance to new heights. Whether you're looking for advanced engine tuning, suspension upgrades, or custom exhaust systems, our team of experts ensures that every detail is optimized for peak power, efficiency, and driving pleasure. Using state-of-the-art diagnostic tools and premium-quality parts, we tailor upgrades specifically to your driving style and vehicle's unique specifications. From enhanced acceleration to improved handling, fuel efficiency, and overall responsiveness, our performance upgrades make every drive a thrilling experience. We take the time to understand your needs and preferences, ensuring that the upgrades we recommend and implement align with your vehicle's capabilities. Trust us to transform your car into a high-performance machine that not only meets but exceeds your expectations. Reach out to us today to learn more or to schedule a consultation with one of our specialists. Let us bring out the best in your vehicle and make every journey unforgettable."
          },
          {
            icon: "⚙️",
            title: "Transmission Services",
            sub: "At Abe-Garage, we understand that your transmission is the heart of your vehicle’s performance. Whether you drive a manual or automatic transmission, ensuring that it operates smoothly is crucial to the overall functionality of your car. Our skilled technicians are equipped to handle a wide range of transmission services, from fluid changes and routine maintenance to diagnosing and repairing complex issues. Ignoring transmission problems such as slipping gears, rough shifting, or unusual noises can lead to expensive repairs and compromised vehicle performance. That’s why we emphasize the importance of regular transmission check-ups to keep everything running smoothly. Our experts use advanced tools and technology to quickly identify and address any issues, offering reliable, cost-effective solutions to get your car back on the road as quickly and safely as possible. Whether it's a minor issue or a major repair, we provide top-notch service tailored to your needs. Schedule your transmission service with us today and ensure your vehicle continues to deliver smooth, seamless power to your wheels."
          },
          {
            icon: "🚗💨",
            title: "Brake Repair & Service",
            sub: "At Abe-Garage, we take your safety seriously by offering comprehensive brake repair and service solutions. Your brake system is one of the most critical components of your vehicle, and regular maintenance is essential to ensure your safety on the road. Our experienced technicians perform thorough inspections of your brake system, checking everything from pads, rotors, and calipers to fluid levels and overall functionality. Whether you need a simple brake pad replacement or a complete brake system overhaul, we use high-quality, durable parts to ensure reliable, long-lasting performance. We understand that a properly functioning brake system is crucial for stopping power, handling, and overall driving comfort. Trust us to provide fast, efficient, and affordable brake repair services, so you can drive with confidence. Don’t wait for issues to escalate—schedule your brake service today and enjoy the peace of mind that comes with knowing your vehicle’s brake system is in expert hands."
          },
          {
            icon: "🛠️",
            title: "Engine Service & Repair",
            sub: "At Abe-Garage, we specialize in engine service and repair, providing you with the expertise needed to keep your engine running at its best. A well-maintained engine is the key to optimal vehicle performance, and our experienced technicians offer comprehensive diagnostics and repairs for all engine-related issues, from performance problems and misfires to oil leaks and overheating. Using state-of-the-art diagnostic tools and technology, we perform thorough inspections to identify and resolve issues quickly and efficiently. Whether it's routine maintenance or more complex engine repairs, we pride ourselves on providing top-quality service that ensures your vehicle runs smoothly and reliably. Our team works diligently to offer long-lasting solutions, so you can get back on the road with confidence. At Abe-Garage, we prioritize your car's engine health, so you can trust us to deliver expert service every time. Let us take care of your engine’s needs and keep it running like new."
          },
          {
            icon: "🛞",
            title: "Tire & Wheels",
            sub: "At Abe-Garage, we provide comprehensive tire and wheel services to ensure your vehicle’s performance, safety, and comfort are always at their peak. Tires and wheels are critical components of your car’s driving experience, and regular maintenance is essential to ensure optimal performance and handling. We offer a variety of tire services, including replacements, balancing, and alignment, to help keep your car running smoothly and safely. Our skilled technicians also perform regular checks of tire pressure, tread depth, and alignment to avoid premature tire wear, poor handling, and potential safety hazards. If your tires are worn out, damaged, or improperly aligned, it can lead to increased fuel consumption, poor handling, and unsafe driving conditions. At Abe-Garage, we help you avoid these issues by providing high-quality tire and wheel services that ensure your vehicle is always ready for the road. Trust us for all your tire and wheel needs and drive with peace of mind."
          },
          {
            icon: "🎨",
            title: "Denting & Painting",
            sub: "At Abe-Garage, we specialize in denting and painting services that restore your vehicle’s appearance and ensure it looks as good as new. Over time, dents, scratches, and other imperfections can affect the aesthetic appeal and value of your car. Our skilled technicians use advanced tools and techniques to remove dents, fix scratches, and restore your car’s bodywork to its original condition. Whether it’s a minor dent or major body damage, we take great care to ensure a flawless finish. Our painting services use high-quality paints that are color-matched perfectly to your vehicle, ensuring a professional, durable finish that lasts. With our denting and painting expertise, we not only enhance the cosmetic appeal of your vehicle but also protect its underlying structure from further damage. At Abe-Garage, we are committed to providing exceptional service and high-quality results, so you can enjoy a vehicle that looks as great as it drives. Let us restore your car to its former glory with our denting and painting services today."
          }
        ].map((service, index) => (
          <div key={index} className="col-md-6 col-xl-4">
            <div key={index} className={`${style.serviceCard} `}>
              <p>Service and Repairs</p>
              <h3>{service.title}</h3>
              <div className={style.serviceIcon}>{service.icon}</div>
              <a className={style.readMore} onClick={() => handleClick(index)}>
                Read {expandedService === index ? "Less" : "More"}
              </a>
              {expandedService === index && <p className={style.serviceSub}>{service.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OurService;
