import MailchimpSubscribe from 'react-mailchimp-subscribe';
import NewsletterForm from './NewsletterForm';

const NewsletterSubscribe = () => {

    const MAILCHIMP_URL = process.env.NEXT_PUBLIC_MAILCHIMP_URL;

    return (
        <MailchimpSubscribe
            url='https://ultraehp.us14.list-manage.com/subscribe/post?u=0a491c3ce98f6f7f51f52c2f5&amp;id=33b8165481&amp;v_id=4454&amp;f_id=003ae9e0f0'
            render={(props) => {
                const { subscribe, status, message } = props || {};
                return (
                    <NewsletterForm
                        status={status}
                        message={message}
                        onValidated={formData => subscribe(formData)}
                    />
                );
            }}
        />
    );
};

export default NewsletterSubscribe;