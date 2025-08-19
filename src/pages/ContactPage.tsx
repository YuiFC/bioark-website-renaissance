import React from 'react';
import { useForm } from 'react-hook-form';
import Layout from '/src/components/Layout';
import Map from '/src/components/Map';
import { Button } from '/src/components/ui/button';
import { Input } from '/src/components/ui/input';
import { Textarea } from '/src/components/ui/textarea';
import { Label } from '/src/components/ui/label';

const ContactPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => {
    console.log('Contact form submitted:', data);
    alert('Thank you for your message! We will get back to you shortly.');
  };

  const location = {
    center: [-77.1537, 39.0840] as [number, number], // Rockville, MD coordinates
    marker: {
      coordinates: [-77.1537, 39.0840] as [number, number],
      popupHtml: '<strong>BioArk Technologies</strong><br/>13 Taft, Suite 213<br/>Rockville, MD, 20850'
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">We'd love to hear from you. Reach out with any questions or inquiries.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card p-8 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" {...register("fullName", { required: true })} />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">This field is required.</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
                {errors.email && <p className="text-red-500 text-sm mt-1">Please enter a valid email.</p>}
              </div>
              <div>
                <Label htmlFor="message">Your Message</Label>
                <Textarea id="message" {...register("message", { required: true })} rows={5} />
                {errors.message && <p className="text-red-500 text-sm mt-1">This field is required.</p>}
              </div>
              <Button type="submit" className="w-full bioark-btn-primary">Submit</Button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="bg-card p-8 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-6">Our Location</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Address:</strong> 13 Taft, Suite 213, Rockville, MD, 20850</p>
                <p><strong>Phone:</strong> 1-734-604-2386</p>
                <p><strong>Email:</strong> support@bioarktech.com</p>
              </div>
            </div>
            <div className="h-80 w-full rounded-lg overflow-hidden">
              <Map center={location.center} marker={location.marker} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;