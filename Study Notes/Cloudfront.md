### Tips
- ACM for Cloudfront should always be in us-east-1
- Self signed certificates do not work with CF

### Field Level Encryption
Is used to provide secure end-to-end connections to origin server by HTTPS. It add an extra layer of security to make sure data is only accessible by a specific instance inside your network (owner of RSA private key)
![[Pasted image 20240801150009.png]]

The following steps provide an overview of setting up field-level encryption. For specific steps, see [Set up field-level encryption](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html#field-level-encryption-setting-up).

1. **Get a public key-private key pair.** You must obtain and add the public key before you start setting up field-level encryption in CloudFront.
    
2. **Create a field-level encryption profile.** Field-level encryption profiles, which you create in CloudFront, define the fields that you want to be encrypted.
    
3. **Create a field-level encryption configuration.** A configuration specifies the profiles to use, based on the content type of the request or a query argument, for encrypting specific data fields. You can also choose the request-forwarding behavior options that you want for different scenarios. For example, you can set the behavior for when the profile name specified by the query argument in a request URL doesn’t exist in CloudFront.
    
4. **Link to a cache behavior.** Link the configuration to a cache behavior for a distribution, to specify when CloudFront should encrypt data.

### Signed URLs and Signed cookies

- In order to create one you need a signer.
- A signer is either a trusted key group or an AWS account that contains a CloudFront key pair (trusted signer).
- Trusted key group is recommended:
	- No need for root user
	- Could be used with API so easier to automate and rotate
	- Could be used with IAM to restrict (for example to upload public keys but not delete them)
	- You can associate higher number of public keys(up to 4 key groups and 5 public key per distribution)
	- 
- Cloudfront Key Pairs is not recommended.
	- Requires root account
	- Could only have 2 active key pairs per AWS account
- With trusted signer you can assign another AWS account as signer

**Reformat the private key (.NET and Java only)**

If you’re using .NET or Java to create signed URLs or signed cookies, you cannot use the private key from your key pair in the default PEM format to create the signature. Instead, do the following:

- **.NET framework** – Convert the private key to the XML format that the .NET framework uses. Several tools are available.
    
- **Java** – Convert the private key to DER format.

### SNI vs Dedicated IP for HTTPS
Read more here: 

https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-https-dedicated-ip-or-sni.html


https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html#private-content-creating-cloudfront-key-pairs




---

## CloudFront Overview

- **Global Content Delivery Network (CDN)** — caches content at **edge locations** worldwide.
- Reduces latency for end users by serving content from the nearest edge location.
- Supports: **S3, ALB, EC2, API Gateway, and custom HTTP origins**.
- Default certificate: `*.cloudfront.net` (free). Custom domain requires **ACM certificate** in `us-east-1`.

## Origins
- **S3 bucket** — static website or object delivery; use **Origin Access Control (OAC)** to restrict direct S3 access.
- **HTTP server** — EC2, ALB, API Gateway, or any public HTTP endpoint.
- **Multiple origins** — use **origin groups** for failover.

## Behaviours
- Cache behaviour rules based on path patterns (e.g., `/api/*` → different cache TTL or origin).
- Control caching: `TTL`, `Cache-Control` headers, `Origin Protocol Policy`.

## Security Features
- **AWS WAF integration** — attach a Web ACL to a CloudFront distribution for L7 filtering.
- **AWS Shield** — free DDoS protection at L3/L4 for all CloudFront distributions.
- **HTTPS enforcement** — `Redirect HTTP to HTTPS` or `HTTPS Only`.
- **OAC (Origin Access Control)** — CloudFront authenticates with S3 using SigV4; prevents direct S3 access.
- **Geo restriction** — allow or block requests by country.

---

## Additional Notes

### Tips
- CloudFront distributions can be used as a WAF attachment target.
- Use **signed URLs or cookies** to control access to private content.
- Invalidate objects using `/*` to clear entire cache (charged per path per invalidation).

### Field Level Encryption
- Encrypts specific fields in POST requests using a **public key** at the edge.
- Only your origin (holding the private key) can decrypt the fields.
- Use case: protect sensitive form fields (e.g., credit card numbers) in transit.

### Signed URLs and Signed Cookies
| Feature | Use Case |
|---------|---------|
| **Signed URL** | Restricts access to a **single file/object** |
| **Signed Cookie** | Restricts access to **multiple files** (e.g., entire video library) |
- Both use a **CloudFront key pair** created by the AWS root account.
- Set expiry time and optional IP restrictions.

### SNI vs Dedicated IP for HTTPS
| Method | Cost | Browser Support |
|--------|------|----------------|
| **SNI (Server Name Indication)** | Free | Modern browsers (2010+) |
| **Dedicated IP** | ~$600/month | All browsers including legacy |
- Use SNI unless you must support very old clients.
